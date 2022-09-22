export const truncateAddress = (address: string) => {
  const beginning = address.substring(0, 7)
  const end = address.slice(address.length - 7)
  return `${beginning}...${end}`
}
