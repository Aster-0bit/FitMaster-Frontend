import { useState } from 'react';
import Navbar from '../common/Navbar/Navbar';
import Routine from '../pages/Routine/Routine';
import Search from '../pages/Search/Search';
import Progress from '../pages/Progress/Progress';
import Profile from '../pages/Profile/Profile';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('Routine');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Routine':
        return <Routine />;
      case 'Search':
        return <Search />;
      case 'Progress':
        return <Progress />;
      case 'Profile':
        return <Profile />;
      default:
        return <Routine />;
    }
  };

  return (
    <div className="dashboardPage">
      <header className="header">
        <Navbar onSelect={setSelectedComponent} />
      </header>
        {renderComponent()}
    </div>
  );
};

export default Dashboard;
