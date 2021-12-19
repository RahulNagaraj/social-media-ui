import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Create from "./components/Create/Create";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="create" element={<Create />} />
            </Routes>
        </div>
    );
}

export default App;
