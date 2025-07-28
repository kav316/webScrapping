import './App.css';
import CostColumn from './components/costColumns'
import missionStatement from './sectionContent/missionStatement.json'
import redditScrapping from './sectionContent/redditResults.json'
import twitterScrapping from './sectionContent/twitterResults.json'


function App() {
  return (
    <div>
      <div className="dashboard-wrapper">
      <div className ="dashboard">
        <CostColumn sections={missionStatement} />
        <CostColumn sections={twitterScrapping}/>
        <CostColumn sections={redditScrapping}/>
      </div>
      </div>
      <div className="addTools">
        <h2> will be adding more to this later</h2>
      </div>

    </div>
    
  );
}

export default App;
