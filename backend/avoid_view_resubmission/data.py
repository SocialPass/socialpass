from collections import UserDict
from uuid import UUID, uuid4


"""Dict like abstraction layer. This module exists in case a project with no SessionMiddleware wants to use AFR"""


class AFRMetaData(UserDict):
    """Interface for AFR meta data"""

    def __init__(self, request):
        # explicitly block UserDict.__init__
        self.request = request

    @property
    def data(self):
        try:
            return self.__data
        except AttributeError:
            self.__data = {}
            return self.__data

    def set_new_data(self, key: UUID):
        self[key] = {}

    @classmethod
    def safe_cast_to_uuid(cls, uuid=None, *, create=False) -> UUID:
        """Tries to convert uuid to UUID, if it fails, it returns a newly created UUID"""
        if not isinstance(uuid, UUID):
            try:
                uuid = UUID(uuid)
            except Exception:
                if not create:
                    raise ValueError('uuid must be a UUID or a string that can be converted to a UUID')
                uuid = uuid4()

        return uuid

    def get_or_create(self, key: UUID) -> tuple[dict, UUID, bool]:
        try:
            return self[key], key, False
        except KeyError:
            pass

        key = self.safe_cast_to_uuid(key)
        self.set_new_data(key)
        return self[key], key, True

    def update(self, key: UUID, data: dict):
        self[key].update(data)

    def set_keyvalue_pair(self, key: UUID, field: str, value: str):
        self[key][field] = value


class SessionBasedAFRMetaData(AFRMetaData):
    """
    - Uses "self.request.session['_afr_metadata']" as internal dict
    - Casts all uuids to string, because uuid is not serializable.
    - Asserts that request.session is marked as modified on every change.
    """

    @property
    def data(self):
        try:
            return self.request.session['_afr_metadata']
        except KeyError:
            self.request.session['_afr_metadata'] = {}
            return self.request.session['_afr_metadata']

    def __getitem__(self, key: UUID):
        return super().__getitem__(str(key))

    def __setitem__(self, key: UUID, value):
        super().__setitem__(str(key), value)
        self.request.session.modified = True

    def __delitem__(self, key):
        super().__delitem__(str(key))
        self.request.session.modified = True

    def __contains__(self, key):
        return str(key) in self.request.session['_afr_metadata']

    def __iter__(self):
        return iter(self.request.session['_afr_metadata'])

    def __len__(self):
        return len(self.request.session['_afr_metadata'])

    def get_or_create(self, key: UUID) -> tuple[dict, UUID, bool]:
        data, uuid, created = super().get_or_create(key)

        if created:
            self.request.session.modified = True

        return data, uuid, created

    def update(self, key: UUID, data: dict):
        super().update(key, data)
        self.request.modified = True

    def set_keyvalue_pair(self, key: UUID, field: str, value: str):
        super().set_keyvalue_pair(key, field, value)
        self.request.modified = True
