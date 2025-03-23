"use client"
import React, { useState } from "react";
import SortingForm from "./SortingForm"; // Import the sorting form

// Define the type for the props of SortButton
interface SortButtonProps {
	onSort: (priorities: string[]) => void; // Assuming `onSort` is a function that takes an array of strings
}

const SortButton: React.FC<SortButtonProps> = ({ onSort }) => {
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

	// Toggle form visibility
	const toggleForm = () => {
		setIsFormVisible(!isFormVisible);
	};

	return (
		<div>
			{/* Floating Button in Bottom Right */}
			<button
				onClick={toggleForm}
				className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
			>
				Sort
			</button>

			{/* Modal for Sorting Form */}
			{isFormVisible && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
						<button
							onClick={toggleForm}
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
						>
							✖
						</button>
						<SortingForm onSort={onSort} setIsFormVisible={setIsFormVisible} />
					</div>
				</div>
			)}
		</div>
	);
};

export default SortButton;
