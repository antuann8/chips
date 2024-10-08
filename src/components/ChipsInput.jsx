import { useEffect, useRef, useState } from 'react'
import s from './ChipsInput.module.css'

export const ChipsInput = function ({ value, onChange }) {
	const [chipsArr, setChipsArr] = useState([])
	const [error, setError] = useState('')
	const contentEditableRef = useRef(null)
	const [cursorPosition, setCursorPosition] = useState(null)

	useEffect(() => {
		const quoteCount = (value.match(/"/g) || []).length
		const hasUnclosedQuote = quoteCount % 2 !== 0
		const hasCommaInsideQuotes = value.includes('"') && value.includes(',')

		if (value.at(-1) === ',' && !hasUnclosedQuote) {
			const trimmedValue = value.slice(0, -1).trim()
			if (trimmedValue && (!hasCommaInsideQuotes || quoteCount % 2 === 0)) {
				setChipsArr(prev => [...prev, trimmedValue])
			}
			onChange('')
		}
	}, [value, onChange])

	useEffect(() => {
		const ref = contentEditableRef.current
		const textNode = ref.childNodes[0]

		if (cursorPosition !== null && textNode) {
			const range = document.createRange()
			const selection = window.getSelection()

			const position = Math.min(cursorPosition, textNode.length)

			range.setStart(textNode, position)
			range.collapse(true)

			selection.removeAllRanges()
			selection.addRange(range)
		}
	}, [value, cursorPosition])

	function handleInput(e) {
		const newValue = e.target.textContent
		const selection = window.getSelection()
		const position = selection.focusOffset

		setCursorPosition(position)
		onChange(newValue)
	}

	function handleBlur() {
		const quoteCount = (value.match(/"/g) || []).length
		const hasUnclosedQuote = quoteCount % 2 !== 0
		const hasCommaInsideQuotes = value.includes('"') && value.includes(',')

		if (hasUnclosedQuote) {
			setError('Закройте кавычки с двух сторон')
		} else {
			setError('')
			const trimmedValue = value.trim()
			if (trimmedValue && (!hasCommaInsideQuotes || quoteCount % 2 === 0)) {
				setChipsArr(prev => [...prev, trimmedValue])
				onChange('')
			}
		}
	}

	return (
		<div className={s.main}>
			<div className={s.inputContainer}>
				{chipsArr.map((item, index) => (
					<div key={index} className={s.chip}>
						<span>{item}</span>
					</div>
				))}
				{chipsArr.length === 0 && !value && (
					<span className={s.placeholder}>Введите ключевые слова</span>
				)}
				<div
					className={s.input}
					contentEditable='true'
					onInput={handleInput}
					onBlur={handleBlur}
					ref={contentEditableRef}
				>
					{value}
				</div>
			</div>
			{error && <div className={s.error}>{error}</div>}
		</div>
	)
}
