import React,{useEffect, useState} from 'react'
import { Link, useParams} from 'react-router-dom'
import {Row,Col,ListGroup,Image,Card,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import {PayPalButton} from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getOrderDetails } from '../features/OrderSlice'
import {payOrder } from '../features/PaymentSlice'

const OrderSreen = () => {
  const {id}=useParams()
  const {orderDetails,loading,error}= useSelector((store)=>store.order) 
  const {loading:loadingPay,success:successPay}= useSelector((store)=>store.payment) 
  const dispatch=useDispatch() 

  const [sdkReady,setSdkReady]=useState(false)

  //AT8Duzxv7ODY47QBiZ6eTVelA52Js8lHV4dpOi_sl1GFtniIoHMMLQfney8JaZYbaJqzPJVHaH-qKl7U

  const addPayPalScript=()=>{
    const script=document.createElement('script')
    script.type='text/javascript'
    script.src="https://www.paypal.com/sdk/js?client-id=AT8Duzxv7ODY47QBiZ6eTVelA52Js8lHV4dpOi_sl1GFtniIoHMMLQfney8JaZYbaJqzPJVHaH-qKl7U"
    script.async=true
    script.onload=()=>{
        setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(()=>{
    if(!orderDetails || successPay || orderDetails._id !== Number(id)){
        dispatch(getOrderDetails(id))
    }else if(!orderDetails.isPaid){
        if(!window.paypal){
            addPayPalScript()
        }else{
            setSdkReady(true)
        }
    }
  },[dispatch,orderDetails,id,successPay])


  let itemsPrice;

  if(!orderDetails){
    return <Loader/>
  }else if(!loading && !error){
    itemsPrice= orderDetails.orderItems.reduce((acc,item)=>acc + item.price * item.qty,0)
  }

  const successPaymentHandler=(paymentResult)=>{
    dispatch(payOrder({id,paymentResult}))
  }

  return loading ? (
    <Loader/>
    ):error ? (
        <Message variant="danger">{error}</Message>
    ):
    (
    <div>
        <h1>Order: {id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong> {orderDetails.user.name}</p>
                        <p><strong>Email: </strong> <a href={`mailto:${orderDetails.user.email}`}>{orderDetails.user.email}</a></p>
                        <p>
                            <strong>Shipping: </strong>
                            {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}
                            {'  '}
                            {orderDetails.shippingAddress.postalCode},
                            {'  '}
                            {orderDetails.shippingAddress.country}
                        </p>
                        
                        {orderDetails.isDelivered ? (
                            <Message variant="success">Delivered on {orderDetails.deliveredAt} </Message>
                        ):(
                            <Message variant="warning"> Not Delivered </Message>
                        )
                        }
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                        <h2>Payment Method</h2>

                        <p>
                            <strong>Method: </strong>
                            {orderDetails.paymentMethod}
                        </p>
                        {orderDetails.isPaid ? (
                            <Message variant="success">Paid on {orderDetails.paidAt} </Message>
                        ):(
                            <Message variant="danger"> Not Paid </Message>
                        )
                        }
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {orderDetails.orderItems.length===0 
                        ?<Message variant="info">
                            Order is empty
                        </Message>
                        :(
                            <ListGroup variant='flush'>
                                {orderDetails.orderItems.map((item,index)=>(
                                    <ListGroup.Item>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>

                                            <Col md={4}>
                                                {item.qty} X ${item.price}= ${(item.qty*item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )   
                        }
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Item:</Col>
                                <Col>${itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${orderDetails.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${orderDetails.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${orderDetails.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        {!orderDetails.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader/>}

                                {!sdkReady ? (
                                    <Loader/>
                                ):(
                                    <PayPalButton
                                    amount={orderDetails.totalPrice}
                                    onSuccess={successPaymentHandler}
                                    />
                                )}
                            </ListGroup.Item>
                        )}

                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default OrderSreen