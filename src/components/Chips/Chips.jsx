import s from './Chips.module.css'

export const Chips = function ({
	chipsArr,
	setChipsArr,
	setSelecting,
	setSelectedChips,
	selecting,
	selectedChips,
	value,
	setCursorPosition,
}) {
	function handleChipInput(e, index) {
		const updatedChip = e.target.textContent
		const selection = window.getSelection()
		const position = selection.focusOffset

		setChipsArr(prev => {
			const newChips = [...prev]
			newChips[index] = updatedChip
			if (updatedChip.trim() === '') {
				return newChips.filter((_, i) => i !== index)
			}
			return newChips
		})

		setCursorPosition({ index, position })
	}

	function handleChipKeyDown(e, index) {
		if (
			(e.key === 'Backspace' || e.key === 'Delete') &&
			!chipsArr[index].trim()
		) {
			setChipsArr(prev => prev.filter((_, i) => i !== index))
		}
	}

	function handleChipBlur(index) {
		const chipText = chipsArr[index]
		const chipParts = chipText
			.split(',')
			.map(part => part.trim())
			.filter(part => part)

		setChipsArr(prev => [
			...prev.slice(0, index),
			...chipParts,
			...prev.slice(index + 1),
		])
	}

	function handleChipDelete(index) {
		setChipsArr(prev => prev.filter((_, i) => i !== index))
	}

	function handleChipMouseDown(index) {
		setSelecting(true)
		if (!selectedChips.includes(index)) {
			setSelectedChips(prev => [...prev, index])
		} else {
			setSelectedChips(prev => prev.filter(i => i !== index))
		}
	}

	function handleChipMouseOver(index) {
		if (selecting && !selectedChips.includes(index)) {
			setSelectedChips(prev => [...prev, index])
		}
	}

	return (
		<>
			{chipsArr.map((item, index) => (
				<div
					key={index}
					className={`${s.chip} ${
						selectedChips.includes(index) ? s.selected : ''
					}`}
					onMouseDown={() => handleChipMouseDown(index)}
					onMouseOver={() => handleChipMouseOver(index)}
					style={{ cursor: 'pointer' }}
				>
					<div
						contentEditable='true'
						onInput={e => handleChipInput(e, index)}
						onBlur={() => handleChipBlur(index)}
						onKeyDown={e => handleChipKeyDown(e, index)}
						className={s.chipContent}
					>
						{item}
					</div>
					<button
						onClick={() => handleChipDelete(index)}
						className={s.deleteButton}
					>
						×
					</button>
				</div>
			))}
			{chipsArr.length === 0 && !value && (
				<span className={s.placeholder}>Введите ключевые слова</span>
			)}
		</>
	)
}
