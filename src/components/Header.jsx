const Header = () => {
    return (
        <div className="border-red-700 flex flex-row rounded-xl mb-2">
            <div className="bg-gray-200 w-50 h-15 border-black rounded-xl border-2 mr-2">logo</div>
            <div className="bg-gray-200 w-200 h-15 border-black rounded-xl border-2">page title</div>
            <div className="bg-gray-200 w-15 h-15 border-black rounded-xl border-2 ml-auto">menu</div>
        </div>
    );
};

export default Header;