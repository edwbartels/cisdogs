import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useReleaseStore from '../stores/releaseStore'
import ReleaseDetailsForm from './ReleaseDetailsForm'

const ReleaseDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const releaseId = id ? parseInt(id, 10) : null
	if (releaseId === null || isNaN(releaseId)) {
		return <p>Invalid Release Id</p>
	}
	const getFocus = useReleaseStore((state) => state.getFocus)
	const release = useReleaseStore((state) => state.focus)

	useEffect(() => {
		getFocus(releaseId)
	}, [getFocus])

	if (!release) return <div>Loading...</div>

	return <ReleaseDetailsForm release={release} />
}

export default ReleaseDetails
