import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

import { EventApi } from '@/services/api'

export default function Home() {
  const navigate = useNavigate()

  const { event }: any = useEvent()
  const { checkout }: any = useCheckout()

  return (
    <>
      <div className='w-100 hs-150 position-relative'>
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img
            src='https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            className='w-100 h-auto'
            alt='Cover image'
          />
        </div>

        <div className='position-absolute z-1 bottom-0 start-0 px-content py-20'>
          <a href='#' className='btn btn-rounded ps-5 d-flex align-items-center'>
            <div className='ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center'>
              <i className='fa-regular fa-arrow-left'></i>
            </div>
            <strong className='text-strong antialiased ms-10'>Go Back</strong>
          </a>
        </div>
      </div>

      <div className='px-content pt-20'>
        <p className='text-muted mt-5 mb-0'>By SocialPass</p>
        <h2 className='text-strong fs-base-p2 fw-700 m-0'>NFT Holders Party</h2>
      </div>

      <div className='row'>
        <div className='col-md-7'>
          <div className='content mt-20 mb-0 me-md-0'>
            <h1 className='text-strong fw-700 fsr-4 m-0'>Complete Checkout</h1>
            <p className='mt-10'>Please select from one of the checkout options below.</p>
            <h6 className='fw-700 fsr-6 mt-20'>Checkout Options</h6>
            <div className='alert alert-primary text-base pe-none user-select-none' role='alert'>
              <h6 className='alert-heading fw-700 m-0'>
                <i className='fa-light fa-check-square text-primary me-5'></i>
                Crypto Payment
              </h6>
              <p className='mt-5 mb-0'>Select from the Crypto payment options below.</p>
            </div>

            <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
              <div>
                <div className='fw-700 antialiased'>Stripe Crypto</div>
                <div className='fs-base-n2 text-muted'>Pay via Stripe</div>
              </div>
              <i className='fa-brands fa-stripe-s ms-auto fs-base-p4'></i>
            </button>

            <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
              <div>
                <div className='fw-700 antialiased'>Coinbase</div>
                <div className='fs-base-n2 text-muted'>Pay via Coinbase</div>
              </div>
              <div className='ws-25 hs-25 ms-auto'>
                <img
                  src='https://www.svgrepo.com/show/331345/coinbase-v2.svg'
                  alt='Logo'
                  className='w-auto h-100'
                />
              </div>
            </button>

            <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
              <div>
                <div className='fw-700 antialiased'>Binance</div>
                <div className='fs-base-n2 text-muted'>Pay via Binance</div>
              </div>
              <div className='ws-25 hs-25 ms-auto'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg'
                  alt='Logo'
                  className='w-auto h-100'
                />
              </div>
            </button>
          </div>
        </div>

        <div className='col-md-5'>
          <div className='px-content pt-md-20 position-md-sticky top-0 start-0'>
            <div className='d-flex align-items-center mb-10'>
              <h6 className='fw-700 fsr-6 m-0'>Summary</h6>

              <div className='text-secondary ms-auto'>
                <a href='#' className='link-reset fw-bold'>
                  Edit
                </a>
              </div>
            </div>

            <div className='py-10 border-top'>
              <h6 className='fw-700 m-0 fs-base d-flex align-items-center'>
                <span>General Admission</span>
                <span className='ms-auto ps-10 fw-normal'>&times; 2</span>
              </h6>
              <div className='fs-base-n2 mt-5'>
                <strong>Price</strong>
                &mdash; 0.05 ETH
              </div>
            </div>

            <div className='py-10 border-top'>
              <h6 className='fw-700 m-0 fs-base d-flex align-items-center'>
                <span>Deluxe Admission</span>
                <span className='ms-auto ps-10 fw-normal'>&times; 1</span>
              </h6>
              <div className='fs-base-n2 mt-5'>
                <strong>Price</strong>
                &mdash; 0.075 ETH
              </div>
            </div>

            <form className='mt-20'>
              <input
                type='text'
                name='email'
                className='form-control'
                placeholder='Email Address'
                value='tahmid@nftylabs.io'
                readOnly
              />
              <button className='btn btn-secondary btn-lg fsr-6 btn-block mt-15' type='submit'>
                <strong className='antialiased'>Continue</strong>
              </button>
            </form>
            <p>
              <strong>Total Price</strong>
              &mdash; 0.125 ETH
            </p>
            <hr />
            <p className='text-muted fs-base-n2'>
              If you need help placing your order, please{' '}
              <a href='#' className='fw-bold' target='_blank'>
                contact us <i className='fa-regular fa-external-link'></i>
              </a>{' '}
              and let us know
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
