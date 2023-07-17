import type { NextPage } from 'next'
import { useRef, FormEvent, useState } from 'react'
import { Form } from 'react-bootstrap'
import CardContainer from '../components/CardContainer'
import TextWrap from '../components/TextWrap'
import { PageProps } from '../types/PageProps'
import { SideType } from '../types/SideType'
import fetchApi from '../utils/helpers/fetchApi'
import FormInput from '../components/FormInput'
import FormSubmit from '../components/FormSubmit'

const Tablecloth: NextPage<PageProps> = ({ locale, labels }) => {
  const [amount, setAmount] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [fabricWidth, setFabricWidth] = useState(0);
  const [fabricAmount, setFabricAmount] = useState(0);
  const [joints, setJoints] = useState(0);
  const [type, setType] = useState('');
  const [result, setResult] = useState('');
  const form = useRef<HTMLFormElement>(null)
  const { Amount, Length, Width, Fabric_Width, Fabric_Amount, Marrow, Hemmed, Tablecloth, No_Joints, One_Joint, Two_Joints, Calculate, Clear } = labels;

  const calculate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { status, data } = await fetchApi('/api/tablecloth', { amount, length, width, fabricWidth, fabricAmount, type, joints }, locale);
    if (status !== 200) {
      setResult(data.message!);
    } else if (data.amount !== -1) {
      setResult(`${data.amount}pcs`);
    } else {
      setResult(`${data.yards}y\n${data.meters}m`);
    }
  }

  const clear = () => {
    form.current!.reset();
    setAmount(0);
    setLength(0);
    setWidth(0);
    setFabricWidth(0);
    setFabricAmount(0);
  }

  return (
    <CardContainer>
      <h2 className='text-center'>{Tablecloth}</h2>
      <Form onSubmit={calculate} ref={form}>
        <div className='text-center'>
          <Form.Check inline type='radio' label={Marrow} name='type' onClick={() => setType(SideType.Marrow)} />
          <Form.Check inline type='radio' label={Hemmed} name='type' onClick={() => setType(SideType.Hemmed)} />
        </div>
        <div className='text-center'>
          <Form.Check inline type='radio' label={No_Joints} name='joints' onClick={() => setJoints(0)} />
          <Form.Check inline type='radio' label={One_Joint} name='joints' onClick={() => setJoints(1)} />
          <Form.Check inline type='radio' label={Two_Joints} name='joints' onClick={() => setJoints(2)} />
        </div>
        <FormInput label={Amount} className='mb-3' controlId='amount' onChange={(e) => setAmount(+e.target.value)} />
        <FormInput label={Length} className='mb-3' controlId='length' onChange={(e) => setLength(+e.target.value)} />
        <FormInput label={Width} className='mb-3' controlId='width' onChange={(e) => setWidth(+e.target.value)} />
        <FormInput label={Fabric_Width} className='mb-3' controlId='fabric-width' onChange={(e) => setFabricWidth(+e.target.value)} />
        <FormInput label={Fabric_Amount} className='mb-3' controlId='fabric-amount' onChange={(e) => setFabricAmount(+e.target.value)} />
        <FormSubmit className='mb-3' calculateLabel={Calculate} clearLabel={Clear} onClear={clear} />
        <TextWrap>{result}</TextWrap>
      </Form>
    </CardContainer>
  )
}

export default Tablecloth