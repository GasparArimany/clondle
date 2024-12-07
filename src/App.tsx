import { Game } from "./components/Game/Game";

export const MAIN_CONTENT_ID = "wordle-main";

function App() {
	return (
		<main
			id={MAIN_CONTENT_ID}
			className="bg-gray-800 text-gray-200 h-screen w-full"
		>
			<Game />
		</main>
	);
}

export default App;
