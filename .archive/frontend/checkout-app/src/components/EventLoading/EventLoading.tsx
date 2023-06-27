import { HashLoader } from "react-spinners";

const EventLoading = () => {
	return (
		<div className='position-absolute top-auto bottom-50 w-100'>
			<div className='d-flex flex-column align-items-center justify-content-center gap-30 text-center'>
				<HashLoader color='#EF7C4E' size={120} />
				<div className='fs-16 fw-500 mt-50'>Loading event, please wait a second...</div>
			</div>
		</div>
	);
};

export default EventLoading;
