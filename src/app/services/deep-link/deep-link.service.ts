import { HelpersService } from './../helpers/helpers.service';
import { DataService } from 'src/app/services/data/data.service';
import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';
import {
  DeepLinkOpen,
  FirebaseDynamicLinks,
  LinkConfig,
} from '@pantrist/capacitor-firebase-dynamic-links';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DeepLinkService {
  constructor(
    private dataService: DataService,
    private helpers: HelpersService,
    private navCtrl: NavController
  ) {}

  async share(project: any): Promise<void> {
    const url = await this.createLink(project);
    await Share.share({
      title: project?.name,
      text: project?.description,
      url,
      dialogTitle: project?.name,
      files: [project?.images],
    });
  }

  async createLink(project: any): Promise<string> {
    await this.helpers.showLoading();
    try {
      const link = await FirebaseDynamicLinks.createDynamicShortLink(
        this.getConfig(project)
      );
      await this.helpers.dismissLoading();
      return link.value;
    } catch (error) {
      await this.helpers.dismissLoading();
      return '';
    }
  }

  private getConfig(project: any): LinkConfig {
    let config: LinkConfig = {
      domainUriPrefix: `https://shamary.page.link/?isi=1673757732/`,
      uri: `${this.dataService.baseURL}/build/details/${project?._id}?project=${project._id}`,
      webApiKey: 'AIzaSyAtrzsFKs5my3BEsaHWoXVetSOM2Za6XEg',
      androidParameters: {
        packageName: 'com.buildingBasem.app',
        // fallbackUrl: `${this.dataService.baseURL}/build/details/${project.companyData?._id}`,
      },

      iosParameters: {
        bundleId: 'com.buildingBasem.app',
        // appStoreId: '1673757732',
        // fallbackUrl: `${this.dataService.baseURL}/build/details/${project?._id}`,
      },
      socialMeta: {
        title: 'باسم الشمري',
      },
    };
    return config;
  }
  createShortLink(id: string): Promise<string> {
    const config: LinkConfig = {
      domainUriPrefix: 'https://shamary.page.link/?isi=1673757732/',
      uri: `${this.dataService.baseURL}/build/details/${id}`,
      webApiKey: 'AIzaSyAtrzsFKs5my3BEsaHWoXVetSOM2Za6XEg',
    };
    return FirebaseDynamicLinks.createDynamicShortLink(config).then(
      (link) => link.value
    );
  }
  listenToDeepLinkOpen(): void {
    FirebaseDynamicLinks.addListener('deepLinkOpen', (data: DeepLinkOpen) => {
      const obj = new URLSearchParams(data.url.slice(data.url.indexOf('?')));
      const project: string | null = obj.get('project');
      console.log(project);

      if (project) this.navCtrl.navigateForward(`/details/${project}`);
    });
  }
}
