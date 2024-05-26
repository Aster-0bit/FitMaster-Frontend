import { useEffect, useState } from 'react';
import { FaStopwatch, FaSearch, FaChartLine, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lineStyle, setLineStyle] = useState({});

  const navItems = [
    { label: "Rutina", icon: <FaStopwatch />, component: 'Routine' },
    { label: "Buscar", icon: <FaSearch />, component: 'Search' },
    { label: "Progreso", icon: <FaChartLine />, component: 'Progress' },
    { label: "Perfil", icon: <FaUser />, component: 'Profile' }
  ];

  useEffect(() => {
    const handleResize = () => {
      const selectedItem = document.querySelector(`.nav-item[data-index="${selectedIndex}"]`);
      if (selectedItem) {
        setLineStyle({
          width: `${selectedItem.offsetWidth}px`,
          left: `${selectedItem.offsetLeft}px`
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedIndex]);

  const handleSelect = (index, component) => {
    setSelectedIndex(index);
    onSelect(component);
  };

  return (
    <nav className="navbar">
      <ul>
        {navItems.map((item, index) => (
          <li
            key={index}
            className="nav-item"
            data-index={index}
          >
            <div
              className={`link ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleSelect(index, item.component)}
            >
              <i>{item.icon}</i>
              <span className="label">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="line" style={lineStyle}></div>
    </nav>
  );
};

export default Navbar;
