import { useState } from 'react'
<<<<<<< HEAD
import { ChipsInput } from './components/ChipsInput'
=======
import { ChipsInput } from './components/ChipsInput/ChipsInput'
>>>>>>> 299e5ab (update)

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
