import React, {useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {Carousel, Image} from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import {getTopProductList} from '../features/ProductSlice'

const ProductCarousel = () => {
  const dispatch= useDispatch()
  const {CarouselLoading,CarouselErrorMessage,topProducts}= useSelector((store)=>store.products)

  useEffect(()=>{
    dispatch(getTopProductList())
  },[dispatch])
  
  return ( CarouselLoading ? <Loader/>
  :CarouselErrorMessage
  ? <Message variant="danger">{CarouselErrorMessage}</Message>
  :(
    <Carousel pause="hover" className='bg-dark'>
        {topProducts.map(product=>(
            <Carousel.Item key={product._id}>
                <Link to={`/product/${product._id}`}>
                    <Image src={product.image} alt={product.name} fluid/>
                    <Carousel.Caption className='carousel.caption'>
                        <h4>{product.name} (${product.price})</h4>
                    </Carousel.Caption>
                </Link>
            </Carousel.Item>
        ))}
    </Carousel>
  )
  )
}

export default ProductCarousel