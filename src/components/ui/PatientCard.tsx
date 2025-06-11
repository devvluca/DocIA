
import React from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Mail, Phone } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <Link to={`/patients/${patient.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {patient.name}
              </h3>
              <p className="text-sm text-muted-foreground">{patient.condition}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{patient.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Última visita: {patient.lastVisit}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 pt-2">
            {patient.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {patient.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{patient.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PatientCard;
