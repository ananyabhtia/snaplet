import { useState } from "react";

const Header = () => {
    const [diagramName, setDiagramName] = useState("untitled-diagram");

    return (
        <div className="border-red-700 flex flex-row rounded-xl mb-2 h-1/16 items-center">
            <div className="flex flex-row w-1/8 h-full rounded-xl mr-6 items-center justify-center">
                <img src="logo.png" className="ml-2"/>
            </div>
            <div className="flex flex-row bg-green-200 w-5/8 h-full rounded-full items-center justify-center">
                <input type="text" className="bg-white ml-2 mr-2 text-black w-1/3 rounded-full pl-2 h-3/4 text-center" value={diagramName} onChange={e => setDiagramName(e.target.value)} />
            </div>
            <i className="fa-solid fa-bars fa-xl ml-auto hover:text-blue-500" />
        </div>
    );
};

export default Header;