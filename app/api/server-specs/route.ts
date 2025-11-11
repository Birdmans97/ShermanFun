import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface ServerSpecs {
  ram: {
    total: string
    used: string
    free: string
    percentage: number
  }
  cpu: {
    usage: number
  }
  storage: {
    total: string
    used: string
    free: string
    percentage: number
  }
  latency: {
    value: number
    unit: string
  }
}

async function getRAMUsage(): Promise<ServerSpecs['ram']> {
  try {
    const { stdout } = await execAsync('free -m')
    const lines = stdout.split('\n')
    const memLine = lines[1].split(/\s+/)
    const total = parseInt(memLine[1])
    const used = parseInt(memLine[2])
    const free = parseInt(memLine[3])
    const percentage = Math.round((used / total) * 100)

    return {
      total: `${total} MB`,
      used: `${used} MB`,
      free: `${free} MB`,
      percentage,
    }
  } catch (error) {
    return {
      total: 'N/A',
      used: 'N/A',
      free: 'N/A',
      percentage: 0,
    }
  }
}

async function getCPUUsage(): Promise<number> {
  try {
    const { stdout } = await execAsync("top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'")
    const usage = parseFloat(stdout.trim())
    return Math.round(usage * 10) / 10
  } catch (error) {
    // Fallback method
    try {
      const { stdout } = await execAsync("grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$3+$4+$5)} END {print usage}'")
      return Math.round(parseFloat(stdout.trim()) * 10) / 10
    } catch {
      return 0
    }
  }
}

async function getStorageUsage(): Promise<ServerSpecs['storage']> {
  try {
    const { stdout } = await execAsync('df -h / | tail -1')
    const parts = stdout.trim().split(/\s+/)
    const total = parts[1]
    const used = parts[2]
    const free = parts[3]
    const percentage = parseInt(parts[4].replace('%', ''))

    return {
      total,
      used,
      free,
      percentage,
    }
  } catch (error) {
    return {
      total: 'N/A',
      used: 'N/A',
      free: 'N/A',
      percentage: 0,
    }
  }
}

async function getLatency(): Promise<ServerSpecs['latency']> {
  try {
    const { stdout } = await execAsync('ping -c 1 -W 2 8.8.8.8')
    const match = stdout.match(/time=([\d.]+)\s*ms/)
    if (match) {
      const value = parseFloat(match[1])
      return {
        value: Math.round(value * 10) / 10,
        unit: 'ms',
      }
    }
    return { value: 0, unit: 'ms' }
  } catch (error) {
    return { value: 0, unit: 'ms' }
  }
}

export async function GET() {
  try {
    const [ram, cpu, storage, latency] = await Promise.all([
      getRAMUsage(),
      getCPUUsage(),
      getStorageUsage(),
      getLatency(),
    ])

    const specs: ServerSpecs = {
      ram,
      cpu: { usage: cpu },
      storage,
      latency,
    }

    return NextResponse.json(specs)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch server specs' },
      { status: 500 }
    )
  }
}

