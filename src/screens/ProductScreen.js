import React, { useEffect, useState } from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import {Row,Col,Image,ListGroup,Button,Card, Form, ListGroupItem} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import {listProductDetails,createProductReview} from '../features/ProductDetailSlice'

const ProductScreen = () => {
  const history=useNavigate()
  const [qty,setQty]= useState(1)
  const [rating,setRating]= useState(0)
  const [comment,setComment]= useState('')

  const {id}=useParams()
  const {product, success, loading, loadingReviews, errorMessage, reviewsErrorMessage}=useSelector((store)=>store.productDetails)
  const {userInfo}= useSelector(store=>store.auth)
  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(listProductDetails(id))
  },[dispatch,id])

  const addToCartHandler=()=>{
    history(`/cart/${id}?qty=${qty}`)
  }

  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(createProductReview({id,review:{rating,comment}}))
    setComment('')
    setRating(0)
  }
  
  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : errorMessage!=="" ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <div>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                  color={"#f"}
                />
              </ListGroup.Item>

              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock >0 && (
                  <ListGroupItem>
                    <Row>
                      <Col>Qty</Col>
                      <Col xs="auto" className='my-1'>
                         <Form.Select 
                         value={qty}
                         onChange={(e)=> setQty(Number(e.target.value))}
                         >
                          {
                            [...Array(product.countInStock).keys()].map((x)=>(
                              <option key={x+1} value={x+1}>
                                {x+1}
                              </option>
                            ))
                          }
                         </Form.Select>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}

                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h4> Reviews </h4>
            {product.reviews.length === 0 && <Message variant="info"> No Reviews </Message>}
            <ListGroup variant='flush'>
              {product.reviews.map((review)=>{
                return <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} color="#f8e825"/>
                  <p>{review.createdAt.substring(0,10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              })}

              <ListGroup.Item>
                <h4>Write a review</h4>
                {loadingReviews && <Loader/>}
                {success && <Message variant="success">Review Submitted</Message>}
                {reviewsErrorMessage!=="" && <Message variant="danger">{reviewsErrorMessage}</Message>}
                
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                      value={rating}
                      onChange={(e)=>setRating(e.target.value)}
                      >
                        <option value="">Select.....</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='my-3' controlId="comment">
                      <Form.Label>Review</Form.Label>
                      <Form.Control
                      as="textarea"
                      value={comment}
                      row="5"
                      onChange={(e)=>setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button
                    disabled={loadingReviews}
                    type="submit"
                    variant="primary"
                    >Submit</Button>

                  </Form>
                ):(
                  <Message variant="info">Please <Link to="/login">Login</Link> to write a review.</Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen