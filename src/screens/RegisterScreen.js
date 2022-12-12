import React,{useState,useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {Form,Row,Col,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import {register} from '../features/AuthSlice'

const RegisterScreen = () => {
  const history= useNavigate()
  const location= useLocation()

  const dispatch=useDispatch()
  const redirect= location.search ? location.search.split('=')[1]: '/'

  const {userInfo,loading,error}= useSelector(store=>store.auth)
  const [name,setName]= useState('')
  const [email,setEmail]= useState('')
  const [password,setPassword]= useState('')
  const [confirmPassword,setConfirmPassword]= useState('')
  const [message,setMessage]=useState('')

  useEffect(()=>{
    if(userInfo){
        history(redirect)
    }
  },[history,userInfo,redirect])

  const submitHandler=(e)=>{
    e.preventDefault()

    if(password !== confirmPassword){
        setMessage('passwords do not match!')
    }else{
        dispatch(register({name,email,password}))
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
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
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="passwordConfirm">
          <Form.Label>Password Confirm</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button className="btn my-3" type="submit" variant="primary">
          Register
        </Button>
      </Form>

      <Row className='py-3'>
            <Col>
               Have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/login'}>Sign In</Link>
            </Col>
        </Row>
    </FormContainer>
  );
}

export default RegisterScreen