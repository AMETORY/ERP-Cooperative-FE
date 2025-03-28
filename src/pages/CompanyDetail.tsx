import type { FC } from 'react';
import AdminLayout from '../components/layouts/admin';

interface CompanyDetailProps {}

const CompanyDetail: FC<CompanyDetailProps> = ({}) => {
        return (<AdminLayout>
            <div className="container">
                <div className="row">
                    COMPANY DETAIl
                </div>
            </div>
        </AdminLayout>);
}
export default CompanyDetail;