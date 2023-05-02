const Error404 = () => {
	return (
		<div className='error-footer'>
			<div className='position-absolute top-auto bottom-50 w-100'>
				<div className='d-flex flex-column align-items-center justify-content-center gap-30 text-center'>
					<span className='fs-20'>Looks like you are lost</span>
					<span className='px-10'>Ask the event organizer for your access link.</span>
				</div>
			</div>
		</div>
	);
};

export default Error404;
