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
  getAccount(): any {
  	return 'not implemented'
  }
  getChainId(): any {
  	return 'not implemented'
  }
  getProvider(): any {
  	return 'not implemented'
  }
  getSigner(): any {
  	return 'not implemented'
  }
  isAuthorized(): any {
  	return 'not implemented'
  }
  onAccountsChanged(): any {
  	return 'not implemented'
  }
  onChainChanged(): any {
  	return 'not implemented'
  }
  onDisconnect(): any {
  	return 'not implemented'
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
