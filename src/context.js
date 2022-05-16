import { createContext } from 'react'

const AddressContext = createContext({
  address: null,
  setAddress: () => {},
})

export default AddressContext
