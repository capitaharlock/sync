export enum RequestStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED'
}
export enum WorkflowStatus {
   PUBLISHED = 'Published',
   DRAFT = "Draft"
}
export enum PublicStatus {
   YES = 'Yes',
   NO = 'No'
}
export interface ModuleItem {
   id: string;
   module_name: string;
   module_type: string;
   language: string;
   framework: string;
   status: WorkflowStatus;
   is_public: PublicStatus;
}
export enum ApiTestingStatus {
   NOT_STARTED="before-executing", 
   EXECUTING="executing", 
   DONE="after-executing"
}

export interface DisplayDetails{
   info: Info;
   items: DisplayItem[];
}
export interface DisplayItem {
   methodName: string,
   path: string,
   summary: string
   // pathDetail: PathDetailItem
}

export interface ScOpenApiSpec {
   openapi: string;
   info: Info;
   paths: Paths;
}

export interface Info {
   title: string;
   version: string;
}

export interface Paths {
   [key: string]: PathDetailItem;
}

export interface PathDetailItem {
   parameters: Parameter[];
   get?: Operation;
   post?: Operation;
   [key: string]: any; // for additional future properties
}

export interface Parameter {
   name: string;
   in: string;
   required: boolean;
   description?: string;
   schema: {
       type: string;
       default?: string;
   };
}

export interface Operation {
   summary: string;
   parameters?: Parameter[];
   requestBody?: RequestBody;
   responses: Responses;
}

export interface RequestBody {
   description: string;
   required: boolean;
   content: Content;
   
}

export interface Content {
   [key: string]: any;
}

export interface Responses {
   [statusCode: string]: Response;
}

export interface Response {
   description: string;
   content: Content;
}

export interface ApiPayload {
   [key: string]: any;
}
export interface ApiTestResults {
   [key: string]: any;
}

export interface WalletDetails {
   pubkey: string;
   network: string;
}
export interface Project {
   id: any;
   name: string;
   networkName?: string;
   description: string;
   ado_id: string;
   status: string;
   visibility: string;
   user_id: any;
   date_time_created: string;
   date_time_modified: string;
   dateCreated?: string;
   isPublic?: PublicStatus;
   walletDetails?: WalletDetails;
   user?: User;
}
export interface User {
   id: any;
   email: string;
   name: string;
   date_time_created: string;
   date_time_modified: string;
}
