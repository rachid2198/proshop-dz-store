import React,{useState} from 'react'
import { useNavigate} from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../features/CartSlice'

const ShippingScreen = () => {
  const history=useNavigate()
  const dispatch=useDispatch()
  const {shippingAddress} = useSelector((store)=>store.cart)


  const [address,setAddress]=useState(shippingAddress.address)
  const [city,setCity]=useState(shippingAddress.city)
  const [postalCode,setPostalCode]=useState(shippingAddress.postalCode)
  const [country,setCountry]=useState(shippingAddress.country)

  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(saveShippingAddress({address,city,postalCode,country}))
    history('/payment')
  }
  return (
    <>
    <CheckoutSteps step1 step2/>
    <FormContainer >
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        
        <Form.Group className="my-2" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        
        <Form.Group className="my-2" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant='primary' className='my-2'>
            Continue
        </Button>

      </Form>
    </FormContainer>
    </>
  );
}

export default ShippingScreen