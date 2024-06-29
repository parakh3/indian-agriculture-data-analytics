import React, { useState, useEffect } from 'react';
import CropAggregationTable from './components/CropAggregationTable';
import data from './data.json'; 

type DataItem = {
  id: number;
  name: string;
};

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataItem[]>([]);

  useEffect(() => {
    setJsonData(data as []); 
  }, []);

  return (
    <div className="App">
      <CropAggregationTable data={jsonData as []} />
    </div>
  );
};

export default App;
