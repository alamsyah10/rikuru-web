"use client"
import React, { useState } from "react";

// Define the type for the sorting options
interface SortingOption {
	key: string;
	label: string;
}

// Define the props for SortingForm component
interface SortingFormProps {
	onSort: (priorities: string[]) => void; // Function to handle sorting with selected priorities
	setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>; // Function to control the visibility of the form
}

const sortingOptions: SortingOption[] = [
	{ key: "能力試験JLPT", label: "能力試験 JLPT" },
	{ key: "学校名", label: "学校名" }
	// Uncomment and add more sorting options if needed
	// { key: "英語レベル", label: "英語レベル" },
	// { key: "年齢", label: "年齢" },
	// { key: "誕生日", label: "誕生日" },
	// { key: "現在の所属", label: "現在の所属" },
];

const SortingForm: React.FC<SortingFormProps> = ({ onSort, setIsFormVisible }) => {
	const [priorities, setPriorities] = useState<string[]>(Array(sortingOptions.length).fill(""));

	// Handle selection change
	const handleSelectChange = (index: number, value: string) => {
		const newPriorities = [...priorities];

		if (priorities.includes(value)) {
			alert("This priority is already selected");
		} else {
			newPriorities[index] = value;
			setPriorities(newPriorities);
		}
	};

	// Apply sorting
	const applySorting = async () => {
		const validPriorities = priorities.filter((p) => p); // Remove empty values
		setIsFormVisible(false);
		await onSort(validPriorities);
		
	};

	return (
		<div className="p-4 bg-white rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-2">ソートの優先順位を選択</h3>
			{priorities.map((_, index) => (
				<div key={index} className="mb-2">
					<label className="mr-2">優先度 {index + 1}:</label>
					<select
						className="border p-1 rounded"
						value={priorities[index]}
						onChange={(e) => handleSelectChange(index, e.target.value)}
					>
						<option value="">-- 選択してください --</option>
						{sortingOptions.map((option) => (
							<option key={option.key} value={option.key}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			))}
			<button className="mt-3 p-2 bg-blue-500 text-white rounded" onClick={applySorting}>
				ソートを適用
			</button>
		</div>
	);
};

export default SortingForm;
