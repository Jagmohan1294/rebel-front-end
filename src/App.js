import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { List, Avatar, Input } from 'antd';
import 'antd/dist/antd.css'

const { Search } = Input
function App() {
  const [images, setImages] = useState([])
  const [brandList, setBrandList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(true)
  /**
   * get images
   */
  useEffect(() => {
    axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beerimages7e0480d.json')
      .then((res) => {
        // console.log(res.data)
        setImages(res.data)
      })
  }, [])
  /**
   * get brand list
   */
  useEffect(() => {
    axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beercraft5bac38c.json')
      .then((res) => {
        // console.log(res.data)
        const listData = res.data.map((item, i) => {
          return ({
            ...item,
            href: '',
            title: item.name,
            avatar: images.length && images[i % 5].image,
            description: item.style,
          })
        })
        setBrandList(listData)
        setLoading(false)
      })
  }, [images])
  const handleSearch = (event) => {
    const value = event.target.value
  //  console.log(value, brandList)
    const name = value.trim().toLowerCase()
    let filtered = brandList.length ? brandList?.filter(it => it.name.toLowerCase().includes(name)) : []
  //  console.log(value, filtered)
    setFilteredList(filtered)
  }
  return (
    <div>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        fontSize: '25px',
        fontWeight: 'bold'
      }}>
        Beer Brands
      </div>
      <div style={{ padding: '10px 180px'}}>
        <Search
          placeholder="search beer brand"
          size="small"
          onChange={handleSearch}
        />
      </div>
      <div style={{
        padding: '20px',
        height: '550px',
        overflow: 'auto',
      }}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 20,
          }}
          dataSource={ filteredList.length ? filteredList: brandList}
          loading={loading}
          renderItem={item => (
            <List.Item
              key={item.id}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              <div>
                <span style={{ paddingLeft: '48px' }}>{item.abv} abv</span>
                <span style={{ paddingLeft: '20px' }}>{item.ounces} ounces</span>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default App;
