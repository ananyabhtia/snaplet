// Header containing Snaplet and McCormick School logos
const Header = () => {

    return (
        <div className="border-red-700 flex flex-row rounded-xl mb-2 h-1/13 items-end">
            <img src="logo.png" className="ml-2 h-full"/>
            <img src="nu-mccormick-logo-2.png" className="ml-2 h-2/3 w-auto ml-auto" />
        </div>
    );
};

export default Header;