import { useEffect, useContext, useState } from 'react'
import { useConnect, useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { TicketedEventRequestAccess, TicketedEventGrantAccess } from '../api'
import { Loading } from '../components/'
import { Web3ConnectorImage } from '../components/Web3ConnectorImage'
import { CheckoutPortalContext } from '../context'
import { truncateAddress } from '../utils'

// ConnectorWallets
// Return UI for wallet connectors
export const CheckoutWeb3 = () => {
  const navigate = useNavigate()
  const [selectedWallet, setSelectedWallet] = useState<any>()

  const [loadingText, setLoadingText] = useState<any>('Loading...')
  const [statusButton, setStatusButton] = useState<any>(true)
  const {
    id,
    retrieveJson,
    requestAccessJson,
    generalAdmissionSelect,
    setRequestAccessJson,
    setRequestAccessError,
    setGrantAccessJson,
    setGrantAccessError,
  } = useContext(CheckoutPortalContext)
  const [loading, setLoading] = useState(false)
  const connectHook = useConnect()
  const disconnectHook = useDisconnect()
  const accountHook = useAccount()
  const signHook = useSignMessage({
    message: requestAccessJson?.signing_message,
  })

  const ConnectWallet = () => {
    // todo: ENS resolution
    const ensName = null
    if (accountHook && accountHook.address) {
      return (
        <div className='connected-wallet-container fs-12'>
          <div className='fw-bold'>
            {ensName ? `${ensName} (${accountHook.address})` : truncateAddress(accountHook.address)}
          </div>
          <div className=''> Connected to {accountHook.connector?.name}</div>
          <button
            className='btn fs-10'
            onClick={() => {
              disconnectHook.disconnect()
              setSelectedWallet(null)
            }}
          >
            Disconnect
          </button>
        </div>
      )
    }
    return (
      <div className='row'>
        {connectHook.connectors.map((connector) => (
          <div className='col-sm-4 pe-sm-10' key={connector.id}>
            <div className='wallet-button'>
              <input
                disabled={!connector.ready}
                onClick={() => {
                  connectHook.connect({ connector })
                  setSelectedWallet(connector)
                }}
                type='radio'
                name='wallet'
                className='wallet-button-input'
                id={connector.id}
                onChange={() => {}} // browser launch a warning log without this
                checked={selectedWallet === connector}
              />
              <label htmlFor={connector.id} className='wallet-button-label'>
                <div className='ws-75 mw-100 mx-auto'>
                  <Web3ConnectorImage connector={connector.name} />
                </div>
                <div className='fs-base-n2 text-strong fw-700 text-truncate text-center mt-10'>
                  {connector.name}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // request access handler (based on web3 account data change)
  useEffect(() => {
    ;(async function () {
      setRequestAccessJson(null)
      setRequestAccessError(null)
      // api call
      const response: any = await TicketedEventRequestAccess.call({
        public_id: id,
        checkout_type: 'blockchain_ownership',
      })
      if (response && response.httpStatus) {
        if (response.httpStatus === 200) {
          setRequestAccessJson(response)
        } else {
          setRequestAccessError(response)
        }
      }
    })()
  }, [])

  // checkout handler
  // handles signing message and posting related data to API
  useEffect(() => {
    ;(async function () {
      if (signHook.data && accountHook && accountHook.address) {
        setLoading(true)
        setLoadingText('Verifying ownership')
        const response = await TicketedEventGrantAccess.call({
          public_id: id,
          checkout_type: 'blockchain_ownership',
          wallet_address: accountHook.address,
          signed_message: signHook.data,
          blockchain_ownership_id: requestAccessJson.id,
          tickets_requested: generalAdmissionSelect,
        })
        if (response) {
          setLoading(false)
        }
        if (response.httpStatus === 200) {
          setGrantAccessJson(response)
          navigate(`/${id}/checkout/success`)
        } else {
          setGrantAccessError(response)
          navigate(`/${id}/checkout/fail`)
        }
      }
    })()
  }, [signHook.data])

  // useeffect hook to flip checkout button status
  // based on wallet address from accountHook
  useEffect(() => {
    if (accountHook && accountHook.address) {
      setStatusButton(false)
    } else {
      setStatusButton(true)
    }
  }, [accountHook])

  async function handleCheckout() {
    setLoadingText('Awaiting wallet signature')
    await signHook.signMessageAsync()
  }

  if (signHook.isLoading || loading) {
    return <Loading loadingText={loadingText} />
  }

  return (
    <>
      <div className='px-content pt-20'>
        <p className='text-muted mt-5 mb-0'>By {retrieveJson?.team.name}</p>
        <h2 className='text-strong fs-base-p2 fw-700 m-0'>{retrieveJson?.title}</h2>
      </div>
      <div className='row'>
        {/* <!-- Checkout information start --> */}
        <div className='col-md-7'>
          <div className='content'>
            <h1 className='text-strong fw-700 fsr-4 mt-0 mb-0'>Complete Checkout</h1>
            <p className='mt-10'>Select from one of the checkout options below.</p>
            <h6 className='text-strong fw-700 fsr-6 mt-30'>Checkout Options</h6>
            <div
              className='alert rounded-3 border-secondary d-flex align-items-center'
              role='alert'
            >
              <div className='text-secondary fs-base-p4'>
                <i className='fa-regular fa-check-circle'></i>
              </div>
              <div className='ms-20'>
                <h6 className='alert-heading text-strong fw-700 mb-0'>Proof of NFT Ownership</h6>
                <p className='my-0'>Select from the crypto wallet options.</p>
              </div>
            </div>

            {/* <!-- Wallet radio buttons start --> */}
            <ConnectWallet />
            {/* <!-- Wallet radio buttons end --> */}

            {/* Wallet error messages start */}
            <div className='mt-15'>
              <span>
                {connectHook.error && (
                  <span className='text-danger fw-600'>
                    {connectHook.error?.message ?? 'Failed to connect'}
                  </span>
                )}
              </span>
              <span className='text-danger fw-600'>
                {signHook.error && <span>{signHook.error?.message ?? 'Failed to connect'}</span>}
              </span>
            </div>
            {/* Wallet error messages end */}
          </div>
        </div>
        {/* <!-- Checkout information end --> */}

        {/* <!-- CTA section start --> */}
        <div className='col-md-5'>
          <div className='p-content position-md-sticky top-0 start-0'>
            <div className='d-flex align-items-center'>
              <h6 className='text-strong fw-700 fsr-6 mt-0 mb-0'>Summary</h6>

              {/* <!-- Edit button start --> */}
              <div className='text-secondary ms-auto'>
                <a onClick={() => navigate(-1)} className='link-reset fw-bold'>
                  Edit
                </a>
              </div>
              {/* <!-- Edit button end --> */}
            </div>
            <p className='mt-10'>
              {generalAdmissionSelect} &times; General Admission Ticket
              <br />
              <strong>Price &mdash; </strong> Free
            </p>
            <button
              onClick={() => handleCheckout()}
              className='btn btn-secondary btn-lg fsr-6 btn-block'
              disabled={statusButton}
            >
              <strong className='antialiased'>Continue</strong>
            </button>
            <div className='form-check mt-15'>
              <input type='checkbox' className='form-check-input pe-none' id='terms-checkbox' checked tabIndex={-1} />
              <label className='form-check-label'>I accept and agree to the <a href='https://drive.google.com/file/u/6/d/1mulvB8lIEl3AZghIBqlISBI-jdNk25W5/view?usp=sharing' target='_blank'  rel='noreferrer'>Terms &amp; Conditions</a> (Required)</label>
            </div>
          </div>
        </div>
        {/* <!-- CTA section end --> */}
      </div>
    </>
  )
}
