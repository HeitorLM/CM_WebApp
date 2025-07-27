// AnalysisCharts.tsx
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line, Area
} from 'recharts';
import { Card, Col, Row, Statistic, Typography, Select } from 'antd';
import {
    SafetyOutlined,
    LikeOutlined,
    CalendarOutlined,
    ClockCircleFilled,
    EnvironmentOutlined,
    HourglassOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { OccurrenceDB } from '../types';

const { Title } = Typography;
const { Option } = Select;

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Funções auxiliares
const getHourFromTimestamp = (timestamp: number) => {
    return new Date(timestamp).getHours();
};

const getDayOfWeekFromTimestamp = (timestamp: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[new Date(timestamp).getDay()];
};

interface AnalysisChartsProps {
    occurrences: OccurrenceDB[];
}

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ occurrences }) => {
    // Estado para o filtro de locationId
    const [selectedLocationId, setSelectedLocationId] = React.useState<string | null>(null);

    // Obter todos os locationIds únicos para o dropdown com seus respectivos nomes
    const locationOptions = React.useMemo(() => {
        const locationMap = new Map<number, string>();

        occurrences.forEach(occ => {
            if (occ.locationId && !locationMap.has(occ.locationId)) {
                // Usar o nome da ocorrência ou um valor padrão se não existir
                const locationName = occ.locationName || `Localização ${occ.locationId}`;
                locationMap.set(occ.locationId, locationName);
            }
        });

        // Converter para array de opções no formato {value, label}
        return Array.from(locationMap).map(([id, name]) => ({
            value: id.toString(),
            label: `${id} - ${name}`
        }));
    }, [occurrences]);

    // Filtrar ocorrências com base no locationId selecionado
    const filteredOccurrences = React.useMemo(() => {
        if (!selectedLocationId) return occurrences;
        return occurrences.filter(occ =>
            occ.locationId?.toString() === selectedLocationId
        );
    }, [occurrences, selectedLocationId]);

    // 1. Top 10 Ocorrências Mais Curtidas
    const topLikedOccurrences = [...filteredOccurrences]
        .sort((a, b) => (b.nThumbsUp || 0) - (a.nThumbsUp || 0))
        .slice(0, 10)
        .map(occ => ({
            name: `${occ.city || 'N/A'}`,
            thumbsUp: occ.nThumbsUp || 0,
            street: occ.street || 'Rua não informada',
            fullLabel: `${occ.street || 'Rua não informada'}`
        }));

    // 2. Distribuição de Confiabilidade e Confiança
    const reliabilityConfidenceData = filteredOccurrences.map(occ => ({
        id: occ.id,
        reliability: occ.reliability,
        confidence: occ.confidence
    }));

    // 3. Ocorrências por Hora do Dia
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
        const hourCount = filteredOccurrences.filter(
            occ => getHourFromTimestamp(occ.timeStamp) === hour
        ).length;
        return { hour, count: hourCount };
    });

    // 4. Ocorrências por Dia da Semana
    const weekdayData = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        .map(day => {
            const dayCount = filteredOccurrences.filter(
                occ => getDayOfWeekFromTimestamp(occ.timeStamp) === day
            ).length;
            return { day, count: dayCount };
        });

    // 7. Tendência Temporal (Série Temporal)
    const timeSeriesData = React.useMemo(() => {
        const dailyData = filteredOccurrences.reduce((acc, curr) => {
            const dateObj = new Date(curr.timeStamp);
            const date = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : '';
            if (date) {
                if (!acc[date]) {
                    acc[date] = {
                        date,
                        count: 0,
                        avgReliability: 0,
                        totalThumbsUp: 0
                    };
                }
                acc[date].count++;
                acc[date].avgReliability += curr.reliability;
                acc[date].totalThumbsUp += curr.nThumbsUp || 0;
            }
            return acc;
        }, {} as Record<string, { date: string; count: number; avgReliability: number; totalThumbsUp: number }>);

        return Object.values(dailyData)
            .map(item => ({
                ...item,
                avgReliability: item.avgReliability / item.count
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [filteredOccurrences]);

    // 10. Dashboard Resumo com KPIs
    const summaryKPIs = {
        totalOccurrences: filteredOccurrences.length,
        avgReliability: filteredOccurrences.reduce((sum, occ) => sum + occ.reliability, 0) / filteredOccurrences.length || 0,
        totalThumbsUp: filteredOccurrences.reduce((sum, occ) => sum + (occ.nThumbsUp || 0), 0),
        avgConfidence: filteredOccurrences.reduce((sum, occ) => sum + occ.confidence, 0) / filteredOccurrences.length || 0
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Filtro por locationId */}
            <Card style={{ marginBottom: 24 }}>
                <Title level={5}>Filtrar por Localização</Title>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Selecione uma localização"
                    allowClear
                    onChange={(value: string | null) => setSelectedLocationId(value)}
                    options={locationOptions}
                    optionFilterProp="label"
                    showSearch
                    filterOption={(input, option) =>
                        option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
                    }
                />
            </Card>

            {/* Seção 1: Top 10 Ocorrências Mais Curtidas */}
            <Card
                title="Top 10 Ocorrências Mais Curtidas"
                style={{ marginBottom: 24 }}
                extra={<LikeOutlined />}
            >
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        layout="vertical"
                        data={topLikedOccurrences}
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={150}
                            tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                        />
                        <Tooltip
                            formatter={(value, name, props) => [
                                value,
                                `${props.payload.fullLabel}\nCurtidas: ${value}`
                            ]}
                        />
                        <Legend />
                        <Bar dataKey="thumbsUp" fill="#FFBB28" name="Curtidas">
                            {topLikedOccurrences.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Seção 2: Distribuição de Confiabilidade e Confiança */}
            <Card
                title="Distribuição de Confiabilidade e Confiança"
                style={{ marginBottom: 24 }}
                extra={<SafetyOutlined />}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={5} style={{ textAlign: 'center' }}>Confiabilidade (5-10)</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    { range: '5-6', count: reliabilityConfidenceData.filter(d => d.reliability >= 5 && d.reliability < 6).length },
                                    { range: '6-7', count: reliabilityConfidenceData.filter(d => d.reliability >= 6 && d.reliability < 7).length },
                                    { range: '7-8', count: reliabilityConfidenceData.filter(d => d.reliability >= 7 && d.reliability < 8).length },
                                    { range: '8-9', count: reliabilityConfidenceData.filter(d => d.reliability >= 8 && d.reliability < 9).length },
                                    { range: '9-10', count: reliabilityConfidenceData.filter(d => d.reliability >= 9 && d.reliability <= 10).length },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" name="Ocorrências">
                                    {[...Array(10).keys()].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col span={12}>
                        <Title level={5} style={{ textAlign: 'center' }}>Confiança (0-5)</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    { range: '0-1', count: reliabilityConfidenceData.filter(d => d.confidence >= 0 && d.confidence <= 1).length },
                                    { range: '1-2', count: reliabilityConfidenceData.filter(d => d.confidence > 1 && d.confidence <= 2).length },
                                    { range: '2-3', count: reliabilityConfidenceData.filter(d => d.confidence > 2 && d.confidence <= 3).length },
                                    { range: '3-4', count: reliabilityConfidenceData.filter(d => d.confidence > 3 && d.confidence <= 4).length },
                                    { range: '4-5', count: reliabilityConfidenceData.filter(d => d.confidence > 4 && d.confidence <= 5).length },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" name="Ocorrências">
                                    {[0, 1, 2, 3, 4].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Card>

            {/* Seção 3: Ocorrências por Hora do Dia */}
            <Card
                title="Ocorrências por Hora do Dia"
                style={{ marginBottom: 24 }}
                extra={<ClockCircleFilled />}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="hour"
                            label={{ value: 'Hora do Dia', position: 'insideBottomRight', offset: -5 }}
                        />
                        <YAxis
                            label={{ value: 'Número de Ocorrências', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value} ocorrências`, 'Quantidade']}
                            labelFormatter={(hour) => `Hora: ${hour}:00`}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            name="Ocorrências"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Area type="monotone" dataKey="count" fill="#8884d8" fillOpacity={0.3} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Seção 4: Ocorrências por Dia da Semana */}
            <Card
                title="Ocorrências por Dia da Semana"
                style={{ marginBottom: 24 }}
                extra={<CalendarOutlined />}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weekdayData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`${value} ocorrências`, 'Quantidade']}
                                />
                                <Bar dataKey="count" fill="#8884d8" name="Ocorrências">
                                    {weekdayData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col span={12}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={weekdayData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="day"
                                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                >
                                    {weekdayData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${value} ocorrências`,
                                        `${props.payload.day} (${((props.payload.count / occurrences.length) * 100).toFixed(1)}%)`
                                    ]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Card>

            {/* 7. Tendência Temporal */}
            <Card
                title="Tendência Temporal"
                style={{ marginBottom: 24 }}
                extra={<HourglassOutlined />}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            name="Ocorrências"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="avgReliability"
                            stroke="#82ca9d"
                            name="Confiabilidade Média"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* 10. Dashboard Resumo com KPIs */}
            <Card
                title="Resumo Estatístico"
                style={{ marginBottom: 24 }}
                extra={< FileTextOutlined />}
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total de Ocorrências"
                                value={summaryKPIs.totalOccurrences}
                                prefix={<EnvironmentOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Confiabilidade Média (5-10)"
                                value={summaryKPIs.avgReliability.toFixed(2)}
                                prefix={<SafetyOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Confiança Média (0-5)"
                                value={summaryKPIs.avgConfidence.toFixed(2)}
                                prefix={<SafetyOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total de Curtidas"
                                value={summaryKPIs.totalThumbsUp}
                                prefix={<LikeOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div >
    );
};