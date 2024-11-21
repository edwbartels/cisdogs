import SubmissionForm from './SubmissionForm'
const Submissions = () => {
	return (
		<div className="flex flex-col">
			<div className="text-2xl text-center">
				Please search releases before making a submissions. We may already have
				what you're looking for!
				<div className="mt-2 italic">Search bar goes here tbd...</div>
			</div>
			<SubmissionForm />
		</div>
	)
}

export default Submissions
