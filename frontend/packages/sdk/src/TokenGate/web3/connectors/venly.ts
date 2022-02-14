import { Connector } from 'wagmi'

export interface IAbstractConnectorOptions {
  network: string;
}

export interface IVenlyConnectorOptions extends IAbstractConnectorOptions {
  clientId: string;
  secretType?: string;
  environment?: string;
}

export class VenlyConnector extends Connector {
  name = 'Venly'
  id = 'venly'
  ready = true;

  constructor(Venly:any,config:any) {
	super(config)
  }

  connect(): any {
	return new Promise(async (resolve, reject) => {
		if (this.options && this.options.clientId) {
		  try {
			const options = {
			  clientId: this.options.clientId,
			  secretType: this.options.secretType || 'ETHEREUM',
			  environment: this.options.environment || 'staging',
			  signMethod: "POPUP"
			};
			const provider = await (window as any).Venly.createProviderEngine(
			  options
			);
			return resolve(provider);
		  } catch (error) {
			console.error(error);
			return reject(new Error("Failed to login to Venly"));
		  }
		} else {
		  return reject(new Error("Please provide an Venly client id"));
		}
	  });
	}

	disconnect(): any {
		return new Promise(() => {
			console.log('disconnected')
		})
	}
}
