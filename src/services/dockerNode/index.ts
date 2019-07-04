import url from 'url';
import axios from 'axios';
import Docker, { Container } from 'dockerode';
import configService from '../config';

class DockerNodeService {
    private docker = new Docker();
    private container: Container | null = null;


    async startContainer() {
        const nodeUlr = url.parse(configService.config.get('docker:env:API_BASE'));
        const image = configService.config.get('docker:image');

        this.container = await this.docker.createContainer({
            Image: image,
            AttachStdin: false,
            OpenStdin: false,
            StdinOnce: false,

            HostConfig: {
                PortBindings: {
                    '6869/tcp': [{HostPort: nodeUlr.port}]
                }
            }
        }).then(container => container.start());

        let retry = 0;
        while (true) {
            if (retry > 3) throw new Error(`Failed access docker node`)
            try {
                await axios.get('node/version', {baseURL: nodeUlr.href});
                break;
            } catch (e) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                retry++;
            }
        }

    }

    async stopContainer() {
        if (this.container == null) return;
        await this.container.stop()
            .then(container => container.remove());
    }
}

export default new DockerNodeService();
