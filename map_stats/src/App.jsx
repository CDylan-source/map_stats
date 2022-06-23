import './App.css';
import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import Axios from 'axios';
import Select from 'react-select'; 



function App() {

  const [loading, setLoading] = useState(true);
  const [seriesList, setSeriesList] = useState([]);
  const [about, setAbout] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [serieSelected, setSerieSelected] = useState('');
  const [countriesData, setCountriesData] = useState([])
  const options = [];

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((data) => {
      setSeriesList(data.data)
      setLoading(false)
  })}, [])



  if(!loading){
    seriesList.forEach((element) => 
    options.push({value: element.code, label: element.nom}))
  } 
  
  const handleChange = (e) => {
    setSerieSelected(e.value);
    setLoadingData(true);
  }

  useEffect(() => {
    if(serieSelected){
      Axios.get(`http://localhost:3001/api/get/${serieSelected}`).then((data) => {
        setCountriesData(data.data)
        setLoadingData(false)
      })
    }
  }, [serieSelected])

  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: 'black',
      
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'black'
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
    }),
    control: (provided) => ({
      ...provided,
      width: '800px',
      maxWidth: '80vw'
    }),
    singleValue: (provided) => {
      const color = 'black'
      return { ...provided, color};
    }
  }
  const handleClick = () =>{
    setAbout(!about);
  }

  let data = [];
  loadingData && !serieSelected ? data = [] : countriesData.forEach((element) => {
    data.push({ country: element.code_pays, value: element.valeurs })
  })

  return (
    <div id="root">
      <div className="titre">
        <h1>Gender statistics</h1>
        <p className='about' onClick={handleClick}>About this site</p>
      </div>
        {about ? <p className='about_text'>I made this site to improve my knowledge of ReactJS and its interaction with a database. The data come from a database of the DataBank of the World Bank named Gender Statistics. A lot of this stats are here to raise awareness about Women Rights worldwide.</p> : ''}
        <label htmlFor="series" className='label_select'>Choose the statistic you want to see then hover the countries, you can double click to zoom (sometimes some countries wil not have any data)</label>
        <Select options={options} styles={customStyles} onChange={handleChange} />
          <WorldMap
          color="white"
          value-suffix="people"
          size="responsive"
          data={data}
          richInteraction={true}
          backgroundColor='transparent'
          borderColor='black'
          strokeOpacity='1'
          />
      </div>
    );
}
export default React.memo(App);