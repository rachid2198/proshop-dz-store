import React,{useState,useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Form,Row,Col,Button, Table} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {getUserDetails, updateUserProfile, listMyOrders} from '../features/ProfileSlice'

const ProfileScreen = () => {
  const history= useNavigate()

  const dispatch=useDispatch()
  const {orders,userDetails,loading,error,success,errorOrders,loadingOrders}= useSelector(store=>store.profile)
  const {userInfo}= useSelector(store=>store.auth)

  const [name,setName]= useState('')
  const [email,setEmail]= useState('')
  const [password,setPassword]= useState('')
  const [confirmPassword,setConfirmPassword]= useState('')
  const [message,setMessage]=useState('')

  useEffect(()=>{
    if(!userInfo){
      history('/login')
    }else{
      if(userDetails ){
        setName(userDetails.name)
        setEmail(userDetails.email)
      }else{
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders("myorders"))
      }
    }
  },[dispatch,history,userDetails,userInfo,success])

  const submitHandler=(e)=>{
    e.preventDefault();
    if(password !== confirmPassword){
      setMessage('passwords do not match!')
    }else{
      dispatch(updateUserProfile({
        'id':userDetails._id,
        'name':name,
        'email':email,
        'password':password
      }))
    }
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="passwordConfirm">
            <Form.Label>Password Confirm</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button className="btn my-3" type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My orders</h2>
        {loadingOrders ? (
          <Loader/>
        ): errorOrders ? (
          <Message variant="danger" > {errorOrders} </Message>
        ):(
          <Table striped responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order=>(
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0,10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt : (
                    <i className='fas fa-times' style={{color:'red'}}></i>
                  )}</td>
                  <td>
                    <Button as={Link} to={`/order/${order._id}`}
                    className="btn-sm"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen