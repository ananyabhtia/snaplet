import { useState } from "react";

// Header containing Snaplet and McCormick School logos
const Header = () => {
    const [diagramName, setDiagramName] = useState("untitled-diagram");

    return (
        <div className="border-red-700 flex flex-row rounded-xl mb-2 h-1/13 items-end">
            <img src="logo.png" className="ml-2 h-full"/>
            <img src="nu-mccormick-logo-2.png" className="ml-2 h-2/3 w-auto ml-auto" />
            {/* <div className="flex flex-row h-full rounded-xl mr-6 items-center">

            </div> */}
            {/* <div className="flex flex-row bg-green-200 w-5/8 h-full rounded-full items-center justify-center">
                <input type="text" className="bg-white ml-2 mr-2 text-black w-1/3 rounded-full pl-2 h-3/4 text-center" value={diagramName} onChange={e => setDiagramName(e.target.value)} />
            </div> */}
            {/* <i className="fa-solid fa-bars fa-xl ml-auto hover:text-blue-500" /> */}
        </div>
    );
};

export default Header;