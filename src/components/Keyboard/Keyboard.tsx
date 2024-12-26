const keys = [
	"Q",
	"W",
	"E",
	"R",
	"T",
	"Y",
	"U",
	"I",
	"O",
	"P",
	"A",
	"S",
	"D",
	"F",
	"G",
	"H",
	"J",
	"K",
	"L",
	"Z",
	"X",
	"C",
	"V",
	"B",
	"N",
	"M",
];

function Keyboard() {
	return (
		<div className="flex flex-col items-center space-y-2">
			<div className="flex space-x-1">
				{keys.slice(0, 10).map((key) => (
					<button
						key={key}
						className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
					>
						{key}
					</button>
				))}
			</div>
			<div className="flex space-x-1">
				{keys.slice(10, 19).map((key) => (
					<button
						key={key}
						className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
					>
						{key}
					</button>
				))}
			</div>
			<div className="flex space-x-1">
				{keys.slice(19).map((key) => (
					<button
						key={key}
						className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
					>
						{key}
					</button>
				))}
			</div>
		</div>
	);
}

export default Keyboard;
