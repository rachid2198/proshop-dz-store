import React,{useState,useEffect} from 'react'
import { useNavigate} from 'react-router-dom'
import {Form,Button,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../features/CartSlice'

const PaymentScreen = () => {
  const history= useNavigate()
  const dispatch=useDispatch()
  const {shippingAddress} = useSelector((store)=>store.cart)

  const [paymentMethod,setPaymentMethod]=useState('PayPal')

  if(shippingAddress.address===""){
    history('/shipping')
  }

  const submitHandler= (e)=>{
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history('/placeorder')
  }

  return (
    <>
    <CheckoutSteps step1 step2 step3/>
    <FormContainer>
        <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3'>
                <Form.Label as="legend">Select Method</Form.Label>
                <Col>
                    <Form.Check
                    type="radio"
                    label="PayPal or Credit Card"
                    id="paypal"
                    name="paymentMethod"
                    checked
                    onChange={(e)=>setPaymentMethod(e.target.value)}
                    >

                    </Form.Check>
                </Col>
            </Form.Group>

            <Button type="submit" variant='primary'>
                Continue
            </Button>
        </Form>
    </FormContainer>
    </>
  )
}

export default PaymentScreen