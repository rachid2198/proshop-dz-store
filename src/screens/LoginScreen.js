import React,{useState,useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {Form,Row,Col,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import {login} from '../features/AuthSlice'

const LoginScreen = () => {
  const history= useNavigate()
  const location= useLocation()

  const dispatch=useDispatch()
  const redirect= location.search ? location.search.split('=')[1]: '/'

  const {userInfo,loading,error}= useSelector(store=>store.auth)
  const [email,setEmail]= useState('')
  const [password,setPassword]= useState('')

  useEffect(()=>{
    if(userInfo){
        history(redirect)
    }
  },[history,userInfo,redirect])

  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(login({email,password}))
  }

  return (
    <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                type="email"
                placeholder='Enter Email'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                type="password"
                placeholder='Enter Password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Button className='btn my-3' type="submit" variant='primary'>
                Sign In
            </Button>
        </Form>

        <Row className='py-3'>
            <Col>
               New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen