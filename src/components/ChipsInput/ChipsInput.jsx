import React, { useEffect, useRef, useState } from 'react'
import { Chips } from '../Chips/Chips'
import s from './ChipsInput.module.css'

export const ChipsInput = function ({ value, onChange }) {
	const [chipsArr, setChipsArr] = useState([])
	const [selectedChips, setSelectedChips] = useState([])
	const [selecting, setSelecting] = useState(false)
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

	useEffect(() => {
		if (
			cursorPosition !== null &&
			cursorPosition.index !== undefined &&
			document.querySelectorAll(`.${s.chipContent}`)[cursorPosition.index]
		) {
			const ref = document.querySelectorAll(`.${s.chipContent}`)[
				cursorPosition.index
			]
			const textNode = ref.childNodes[0]

			if (textNode) {
				const range = document.createRange()
				const selection = window.getSelection()

				const position = Math.min(cursorPosition.position, textNode.length)

				range.setStart(textNode, position)
				range.collapse(true)

				selection.removeAllRanges()
				selection.addRange(range)
				ref.focus()
			}
		}
	}, [cursorPosition])

	function handleMouseUp() {
		setSelecting(false)
	}

	function handleKeyDown(e) {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			if (selectedChips.length > 0) {
				setChipsArr(prev => prev.filter((_, i) => !selectedChips.includes(i)))
				setSelectedChips([])
			} else if (
				document.activeElement === contentEditableRef.current &&
				chipsArr.length
			) {
				const selection = window.getSelection()
				const position = selection.focusOffset

				if (position === 0 || e.key === 'Backspace') {
					const lastIndex = chipsArr.length - 1
					const lastChipText = chipsArr[lastIndex].trim()
					if (
						!lastChipText ||
						(document.activeElement.textContent === '' && position === 0)
					) {
						setChipsArr(prev => prev.slice(0, -1))
					}
				}
			}
		}
	}

	return (
		<div className={s.main} onKeyDown={handleKeyDown} onMouseUp={handleMouseUp}>
			<div className={s.inputContainer}>
				<Chips
					chipsArr={chipsArr}
					setChipsArr={setChipsArr}
					setSelecting={setSelecting}
					setSelectedChips={setSelectedChips}
					selecting={selecting}
					selectedChips={selectedChips}
					value={value}
					setCursorPosition={setCursorPosition}
				/>
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
