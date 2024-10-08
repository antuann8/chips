import { useState } from 'react'
import { ChipsInput } from './components/ChipsInput'

function App() {
	const [value, setValue] = useState('')
	return (
		<div>
			<div>
				<ChipsInput value={value} onChange={setValue} />
			</div>
		</div>
	)
}

export default App
