import { useQuery } from "react-query";
import { useEvent } from "../../contexts/EventContext";
import { fetchTickets } from "../../services/api";

export function StatisticsTable() {
  const { publicId }: any = useEvent()
  const { isLoading, isError, error, data } = useQuery(
    ['fetchTickets', publicId],
    () => fetchTickets(publicId, true)
  )

  if (isLoading) return <>Loading</>
  if (isError) return <>Oops something went wrong</>

  return (
    <div className="container p-10 d-flex flex-column align-items-center">
      <table>
        <thead>
          <tr>
            <th>Issued at</th>
            <th>Wallet Address</th>
            <th>Redeemed at</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ticket: any) => (
            <tr key={ticket.public_id}>
              <td>{ticket.created}</td>
              <td>{ticket.wallet_address}</td>
              <td>{ticket.redeemed_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
