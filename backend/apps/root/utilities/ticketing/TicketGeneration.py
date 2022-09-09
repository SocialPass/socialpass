class TicketGenerationBase:
    def generate_pass_from_ticket(self, ticket):
        """
        generate a pass with an Ticket object
        """
        raise NotImplementedError

    def get_bytes(self):
        """
        get the pass bytes. Useful to send via email or as file
        """
        raise NotImplementedError

    def get_pass_url(self):
        """
        get the url to access the pass (Google Wallet)
        """
        raise NotImplementedError

    def write_to_file(self, filename):
        """
        save the pass in disk
        """
        raise NotImplementedError
