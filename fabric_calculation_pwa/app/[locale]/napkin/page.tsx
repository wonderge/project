"use client"

import { useState } from 'react'
import { Alert, Form } from 'react-bootstrap'
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import CardContainer from '@components/CardContainer';
import TextWrap from '@components/TextWrap';
import FormSubmit from '@components/FormSubmit';
import FormInput from '@components/FormInput';
import fetchApi from '@utils/fetchApi';
import { SideType } from '@utils/types';

const Napkin = () => {
  const { register, handleSubmit, reset } = useForm()
  const t = useTranslations()
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    const { status, result } = await fetchApi('/api/napkin', data);
    if (status !== 200) {
      setError(result.message!);
    } else if (result.hasOwnProperty('amount')) {
      setResult(`${result.amount}pcs`);
    } else {
      setResult(`${result.yards}y\n${result.meters}m`);
    }
  }

  const clear = (): void => {
    reset()
    setResult('')
    setError('')
  }

  const registerAsNum = (name: any) => register(name, { setValueAs: (v) =>  v === "" ? 0: parseFloat(v) })

  return (
    <CardContainer>
      <h2 className='text-center'>{t("Napkin")}</h2>
      {error && (<Alert variant='danger'>{error}</Alert>)}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='text-center'>
          <Form.Check inline type='radio' label={t("Marrow")} {...register("type")} value={SideType.Marrow} />
          <Form.Check inline type='radio' label={t("Hemmed")} {...register("type")} value={SideType.Hemmed} />
        </div>
        <FormInput label={t("Amount")} className='mb-3' controlId='amount' {...registerAsNum("amount")} />
        <FormInput label={t("Length")} className='mb-3' controlId='length' {...registerAsNum("length")} />
        <FormInput label={t("Width")} className='mb-3' controlId='width' {...registerAsNum("width")} />
        <FormInput label={t("Fabric_Width")} className='mb-3' controlId='fabric-width' {...registerAsNum("fabricWidth")} />
        <FormInput label={t("Fabric_Amount")} className='mb-3' controlId='fabric-amount' {...registerAsNum("fabricAmount")} />
        <FormSubmit className='mb-3' calculateLabel={t("Calculate")} clearLabel={t("Clear")} onClear={clear} />
        <TextWrap>{result}</TextWrap>
      </Form>
    </CardContainer>
  )
}

export default Napkin