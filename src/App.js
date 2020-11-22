import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { List, Avatar } from 'antd';
import 'antd/dist/antd.css'

function App() {
  const [images, setImages] = useState([])
  const [brandList, setBrandList] = useState([])
  const [loading, setLoading] = useState(true)
  /**
   * get images
   */
  useEffect(() => {
    axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beerimages7e0480d.json')
    .then((res) => {
      console.log(res.data)
      setImages(res.data)
    })
  }, [])
  /**
   * get brand list
   */
  useEffect(() => {
    axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beercraft5bac38c.json')
      .then((res) => {
        console.log(res.data)
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
      <div style={{
        padding:'20px'
      }}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 4,
          }}
          dataSource={brandList}
          loading={loading}
          renderItem={item => (
            <List.Item
              key={item.title}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              <div>
                <span>{item.abv} abv</span>               
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
