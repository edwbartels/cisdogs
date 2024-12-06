import SubmissionForm from './SubmissionForm'
const Submissions = () => {
	return (
		<div className="flex flex-col">
			<div className="text-2xl text-center">
				Please browse through releases before making a submission. We may
				already have what you're looking for!
			</div>
			<SubmissionForm />
		</div>
	)
}

export default Submissions
