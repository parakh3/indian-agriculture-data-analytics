import { Table, TableTbody, TableThead } from '@mantine/core';
import React, { useEffect, useState } from 'react';

interface CropData {
  Year: number;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': string;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': string;
  'Area Under Cultivation (UOM:Ha(Hectares))': string;
}

interface MaxMinData {
  Year: number;
  CropWithMaxProduction: string;
  CropWithMinProduction: string;
}

interface AverageData {
  CropName: string;
  AverageYield: string;
  AverageArea: string;
}

const CropAggregationTable: React.FC<{ data: CropData[] }> = ({ data }) => {
  const [maxMinData, setMaxMinData] = useState<MaxMinData[]>([]);
  const [averageData, setAverageData] = useState<AverageData[]>([]);
  useEffect(() => {
    const aggregateData = () => {
      const yearCropProduction: Record<number, { cropName: string, productionValue: number }[]> = {};
      const cropYield: Record<string, number[]> = {};
      const cropArea: Record<string, number[]> = {};

      data.forEach(entry => {
        const year = entry.Year;
        const cropName = entry['Crop Name'];
        const production = parseFloat(entry['Crop Production (UOM:t(Tonnes))']);
        const yieldValue = parseFloat(entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']);
        const areaValue = parseFloat(entry['Area Under Cultivation (UOM:Ha(Hectares))']);

        // Check for NaN values and ignore invalid entries
        if (!isNaN(production)) {
          if (!yearCropProduction[year]) {
            yearCropProduction[year] = [];
          }
          yearCropProduction[year].push({ cropName, productionValue: production });
        }

        if (!isNaN(yieldValue)) {
          if (!cropYield[cropName]) {
            cropYield[cropName] = [];
          }
          cropYield[cropName].push(yieldValue);
        }

        if (!isNaN(areaValue)) {
          if (!cropArea[cropName]) {
            cropArea[cropName] = [];
          }
          cropArea[cropName].push(areaValue);
        }
      });

      // Calculate max/min production for each year
      const maxMinTable = Object.keys(yearCropProduction).map((year: any) => {
        const crops: { cropName: string, productionValue: number }[] = yearCropProduction[year];

        const maxCrop = crops.reduce((prev, current) =>
          prev.productionValue > current.productionValue ? prev : current
        );

        const minCrop = crops.reduce((prev, current) =>
          prev.productionValue < current.productionValue ? prev : current
        );

        return {
          Year: year,
          CropWithMaxProduction: `${maxCrop.cropName} (${maxCrop.productionValue} tonnes)`,
          CropWithMinProduction: `${minCrop.cropName} (${minCrop.productionValue} tonnes)`
        };
      });


      // Calculate average yield and area
      const averagedYield: AverageData[] = Object.keys(cropYield).map(crop => ({
        CropName: crop,
        AverageYield: (cropYield[crop].reduce((acc, val) => acc + val, 0) / cropYield[crop].length).toFixed(3),
        AverageArea: cropArea[crop].length > 0 ? (cropArea[crop].reduce((acc, val) => acc + val, 0) / cropArea[crop].length).toFixed(3) : 'N/A'
      }));

      setMaxMinData(maxMinTable as []);
      setAverageData(averagedYield);
    };

    // Call aggregateData function
    aggregateData();
  }, [data]);

  return (
    <div>
      <h2>Aggregated Crop Data</h2>
      <div>
        <h3>Max/Min Production Data</h3>
        <Table style={{ maxWidth: 600, margin: '0 auto', border: '1px solid black', textAlign: 'center' }}>
          <TableThead>
            <Table.Tr style={{ border: '1px solid black' }} >
              <Table.Th>Year</Table.Th>
              <Table.Th>Crop with Maximum Production</Table.Th>
              <Table.Th>Crop with Minimum Production</Table.Th>
            </Table.Tr>
          </TableThead>
          <TableTbody>
            {maxMinData.map((entry, index) => (
              <Table.Tr key={index} style={{ border: '1px solid black' }}>
                <Table.Td >{entry.Year}</Table.Td>
                <Table.Td>{entry.CropWithMaxProduction}</Table.Td>
                <Table.Td>{entry.CropWithMinProduction}</Table.Td>
              </Table.Tr>
            ))}
          </TableTbody>
        </Table>
      </div>

      <div>
        <h3>Average Yield and Cultivation Area (1950-2020)</h3>
        <Table style={{ maxWidth: 600, margin: '0 auto', border: '1px solid black', textAlign: 'center' }}>
          <TableThead>
            <Table.Tr>
              <Table.Th>Crop Name</Table.Th>
              <Table.Th>Average Yield of the crop between 1950-2020</Table.Th>
              <Table.Th>Average Cultivation Area of the crop between 1950-2020</Table.Th>
            </Table.Tr>
          </TableThead>
          <TableTbody>
            {averageData.map((entry, index) => (
              <Table.Tr key={index}>
                <Table.Td>{entry.CropName}</Table.Td>
                <Table.Td>{entry.AverageYield}</Table.Td>
                <Table.Td>{entry.AverageArea}</Table.Td>
              </Table.Tr>
            ))}
          </TableTbody>
        </Table>
      </div>
    </div>
  );
};

export default CropAggregationTable;
