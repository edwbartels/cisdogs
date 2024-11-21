const SubmissionForm = () => {
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="p-10 text-center border w-96 border-wax-black aspect-video">
					Image Upload tbd...
				</div>
			</div>
			<div className="flex w-full">
				<form className="flex w-full p-4 bg-wax-gray bg-opacity-30">
					<div className="flex flex-col justify-between w-1/2">
						<div>
							<div className="flex flex-col w-4/5 ">
								<div className="ml-2 font-semibold">Artist</div>
								<input type="text" className="pl-2"></input>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album</div>
								<input type="text" className="pl-2"></input>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Release</div>
								<input type="text" className="pl-2"></input>
							</div>
						</div>
						<button
							type="submit"
							className="w-4/5 ml-1 rounded-md ring-2 ring-wax-blue text-wax-cream bg-wax-teal hover:ring-4"
						>
							Submit
						</button>
					</div>
					<div className="flex flex-col items-center w-1/2">
						<div className="font-semibold text-center">Format</div>
						<div className="flex justify-center mt-1 space-x-3">
							<label>
								<input type="radio" name="format" value="vinyl" />
								{`  Vinyl`}
							</label>
							<label>
								<input type="radio" name="format" value="CD" />
								{`  CD`}
							</label>
							<label>
								<input type="radio" name="format" value="Cassette" />
								{`  Cassette`}
							</label>
						</div>
						<div className="mt-2 font-semibold text-center">
							Submit a track list?
						</div>
						<div className="text-sm italic text-center">Optional</div>
						<button className="w-3/5 mt-4 rounded-md ring-2 ring-wax-silver text-wax-gray bg-wax-cream hover:ring-4">
							Add Tracks
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
export default SubmissionForm
