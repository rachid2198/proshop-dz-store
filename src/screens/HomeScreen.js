import React, { useEffect } from 'react'
import {Row,Col} from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductCarousel from '../components/ProductCarousel'
import {useDispatch,useSelector} from 'react-redux'
import {getProductList} from '../features/ProductSlice'
import { useLocation } from 'react-router-dom'

const HomeScreen = () => {
  const location=useLocation()
  const {products,loading,errorMessage}=useSelector((store)=>store.products)
  const dispatch=useDispatch()

  let keyword=location.search

  useEffect(()=>{
     dispatch(getProductList(keyword))
  },[dispatch,keyword])

  return (
    <div>
      {!keyword && <ProductCarousel/>}
      <h1 className='my-3'>Latest products</h1>
      {loading ? (
        <Loader/>
      ) : errorMessage!=="" ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <Row>
          {products.map((product) => {
            return (
              <Col key={product._id} sm="12" md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen